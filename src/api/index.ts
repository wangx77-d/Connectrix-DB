import { Router } from 'express';
import tableRoutes from './tables';
import recordRoutes from './records';

const router = Router();

router.use('/tables', tableRoutes);
router.use('/records', recordRoutes);

export default router;
