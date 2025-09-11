import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export default async function handler(req:any,res:any){
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).end();

  const { user_id, tool_id, kind='tool', payload={} } = req.body||{};
  if(!user_id||!tool_id) return res.status(400).json({error:'missing body'});

  const client = await pool.connect();
  try {
    await client.query('begin');

    const up = await client.query(
      `insert into usage_ledger (user_id, tool_id, month_key, used, credit_limit)
       values ($1,$2,to_char(now() at time zone 'UTC','YYYYMM'),1,
               coalesce((select limit_monthly from tools where id=$2),500))
       on conflict (user_id, tool_id, month_key)
       do update set used = usage_ledger.used + 1, updated_at = now()
       where usage_ledger.blocked=false and usage_ledger.used<usage_ledger.credit_limit
       returning id, used, credit_limit, blocked`,
      [user_id, tool_id]
    );

    if(up.rowCount===0){
      const s = await client.query(
        `select used, credit_limit, true as blocked
           from usage_ledger
          where user_id=$1 and tool_id=$2
            and month_key=to_char(now() at time zone 'UTC','YYYYMM')`,
        [user_id, tool_id]
      );
      await client.query('rollback');
      const r=s.rows[0]||{used:0,credit_limit:0,blocked:true};
      return res.status(403).json({...r, remaining:Math.max(0,r.credit_limit-r.used)});
    }

    const led = up.rows[0];
    await client.query(
      `insert into usage_log (ledger_id,user_id,tool_id,kind,payload)
       values ($1,$2,$3,$4,$5)`,
      [led.id,user_id,tool_id,kind,payload]
    );

    await client.query('commit');
    res.json({used:led.used,credit_limit:led.credit_limit,remaining:Math.max(0,led.credit_limit-led.used),blocked:led.blocked||led.used>=led.credit_limit});
  } catch(e){
    await client.query('rollback');
    res.status(500).json({error:'server',detail:String(e)});
  } finally { client.release(); }
}
