import { connectDB, disconnectDB } from '../config/db';
import { recountPatients } from '../services/maintenance.service';

(async () => {
  await connectDB();
  console.log('Recounted:', await recountPatients());
  await disconnectDB();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
