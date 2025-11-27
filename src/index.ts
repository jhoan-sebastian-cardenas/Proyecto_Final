import { ElysiaApiAdapter } from "./adapter/api/elysia";
import { FileSystemPhotoRepository } from "./adapter/photo/filesystem";
import { InMemoryDeviceRepository } from "./adapter/repository/inmemory";
import { ComputerService, DeviceService, MedicalDeviceService } from "./core/service";

// Repositorios
const deviceRepository = new InMemoryDeviceRepository();
const photoRepository = new FileSystemPhotoRepository();

// Puerto definido por Azure (o 3000 localmente)
const port = Number(process.env.PORT) || 3000;

// URL base: usa APP_URL en Azure o localhost en desarrollo
const baseUrl =
    process.env.APP_URL || `http://localhost:${port}`;

// Servicios
const computerService = new ComputerService(
    deviceRepository,
    photoRepository,
    new URL(`${baseUrl}/api`)
);

const deviceService = new DeviceService(deviceRepository);

const medicalDeviceService = new MedicalDeviceService(
    deviceRepository,
    photoRepository
);

// API principal
const app = new ElysiaApiAdapter(
    computerService,
    deviceService,
    medicalDeviceService
);

app.run();
