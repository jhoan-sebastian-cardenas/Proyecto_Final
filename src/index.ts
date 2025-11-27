import { ElysiaApiAdapter } from "./adapter/api/elysia";
import { FileSystemPhotoRepository } from "./adapter/photo/filesystem";
import { InMemoryDeviceRepository } from "./adapter/repository/inmemory";
import { ComputerService, DeviceService, MedicalDeviceService } from "./core/service";

const deviceRepository = new InMemoryDeviceRepository()
const photoRepository = new FileSystemPhotoRepository()

// Determinar si estamos en modo desarrollo
const isWatchMode = process.argv.includes('--watch');
const isDevelopment = isWatchMode || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
const port = process.env.PORT || (isDevelopment ? 3000 : 443);
const computerService = new ComputerService(
    deviceRepository, 
    photoRepository, 
    new URL(`http://localhost:${port}/api`)
)

const deviceService = new DeviceService(deviceRepository)

const medicalDeviceService = new MedicalDeviceService(
    deviceRepository,
    photoRepository
)

const app = new ElysiaApiAdapter(
    computerService,
    deviceService,
    medicalDeviceService
)

app.run()
