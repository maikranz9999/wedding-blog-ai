import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

export default async function handler(req:any,res:any){
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();

  const { id, slug } = req.query;

  let q;
  if (id) {
    q = await pool.query('select * from tools where id=$1 and active=true limit 1',[id]);
  } else if (slug) {
    q = await pool.query('select * from tools where slug=$1 and active=true limit 1',[slug]);
  } else {
    q = await pool.query('select * from tools where active=true order by id');
  }

  if(!q.rowCount) return res.status(404).json({error:'not found'});
  res.json(id||slug ? q.rows[0] : q.rows);
}
