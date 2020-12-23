import { main } from './Main';
import process from 'process';

try {
  main(process.argv);
} catch (err) {
  console.log(err);
  process.exit(-1);
}
