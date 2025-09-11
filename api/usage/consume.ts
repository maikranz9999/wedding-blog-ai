import { Pool } from 'pg';
import crypto from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  // Body
  const { user_id, tool_id, kind = 'tool', payload = {}, request_id } = req.body || {};
  if (!user_id || !tool_id) return res.status(400).json({ error: 'missing body' });

  // Id für Idempotenz (client-provided oder neu generiert)
  const rid: string = request_id || crypto.randomUUID();

  const client = await pool.connect();
  try {
    await client.query('begin');

    // Früh-Idempotenz: Falls request_id schon geloggt wurde, NICHT erneut zählen
    const exists = await client.query('select 1 from usage_log where request_id = $1', [rid]);
    if (exists.rowCount) {
      const s = await client.query(
        `select used, credit_limit, blocked
           from usage_ledger
          where user_id=$1 and tool_id=$2
            and month_key = to_char(now() at time zone 'UTC','YYYYMM')`,
        [user_id, tool_id]
      );

      // Falls es (ausnahmsweise) noch keinen Ledger gibt, Limit aus tools ziehen
      let used = 0, credit_limit = 500, blocked = false;
      if (s.rowCount) {
        used = s.rows[0].used ?? 0;
        credit_limit = s.rows[0].credit_limit ?? 500;
        blocked = s.rows[0].blocked ?? false;
      } else {
        const l = await client.query('select limit_monthly from tools where id=$1', [tool_id]);
        credit_limit = l.rows[0]?.limit_monthly ?? 500;
      }

      await client.query('commit');
      return res.json({
        used,
        credit_limit,
        remaining: Math.max(0, credit_limit - used),
        blocked,
        idempotent: true
      });
    }

    // Ledger anlegen/hochzählen, nur wenn nicht gesperrt und unter Limit
    const up = await client.query(
      `insert into usage_ledger (user_id, tool_id, month_key, used, credit_limit)
       values ($1,$2,to_char(now() at time zone 'UTC','YYYYMM'), 1,
               coalesce((select limit_monthly from tools where id=$2), 500))
       on conflict (user_id, tool_id, month_key)
       do update set used = usage_ledger.used + 1, updated_at = now()
       where usage_ledger.blocked = false
         and usage_ledger.used < usage_ledger.credit_limit
       returning id, used, credit_limit, blocked`,
      [user_id, tool_id]
    );

    // Limit erreicht oder gesperrt
    if (up.rowCount === 0) {
      const s = await client.query(
        `select used, credit_limit, true as blocked
           from usage_ledger
          where user_id=$1 and tool_id=$2
            and month_key = to_char(now() at time zone 'UTC','YYYYMM')`,
        [user_id, tool_id]
      );
      await client.query('rollback');
      const r = s.rows[0] || { used: 0, credit_limit: 0, blocked: true };
      return res.status(403).json({ ...r, remaining: Math.max(0, r.credit_limit - r.used) });
    }

    const led = up.rows[0];

    // Log schreiben (mit request_id; schützt auch serverseitig vor Doppel-Insert)
    await client.query(
      `insert into usage_log (ledger_id, user_id, tool_id, kind, payload, request_id)
       values ($1,$2,$3,$4,$5,$6)`,
      [led.id, user_id, tool_id, kind, payload, rid]
    );

    await client.query('commit');

    res.json({
      used: led.used,
      credit_limit: led.credit_limit,
      remaining: Math.max(0, led.credit_limit - led.used),
      blocked: led.blocked || led.used >= led.credit_limit
    });
  } catch (e: any) {
    await client.query('rollback');
    res.status(500).json({ error: 'server', detail: String(e) });
  } finally {
    client.release();
  }
}
