import { promises as fs } from 'fs';
import Dropdown from './Components/Dropdown';


export default async function Home() {
  const file = await fs.readFile(process.cwd() + '/app/data/exchange-list.json', 'utf-8');
  const data = JSON.parse(file);

  return (
    <div className='pt-24 max-w-[920px] mx-auto mb-8'>
      <div className='mb-5'>
        <Dropdown props={data} />
      </div>
  </div>
  );
}
