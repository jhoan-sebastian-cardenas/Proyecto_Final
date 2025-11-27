import { DeviceId } from "@/core/domain";
import { DevicePhotoRepository } from "@/core/repository";
import { Server } from "bun";

// Usar puerto dinámico para el servidor de archivos de fotos
const isWatchMode = process.argv.includes('--watch');
const isDevelopment = isWatchMode || !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
const MEDIA_PORT = Bun.env.MEDIA_PORT || (isDevelopment ? 8081 : 8443);
const BASE_PATH = "./public";
const BASE_URL = `http://localhost:${MEDIA_PORT}/photo/`;

export class FileSystemPhotoRepository implements DevicePhotoRepository {
  public server: Server<any> | null = null;

  constructor() {
    // Solo crear el servidor si estamos en modo desarrollo
    if (isDevelopment) {
      try {
        this.server = Bun.serve({
          port: MEDIA_PORT,
          routes: {
            "/photo/:filename": req => new Response(Bun.file(`${BASE_PATH}/${req.params.filename}`))
          },
          error() {
            return new Response(null, { status: 404 })
          }
        });
      } catch (error: unknown) {
        console.warn("No se pudo iniciar el servidor de fotos:", (error as Error).message);
        this.server = null;
      }
    } else {
      console.log("Servidor de fotos desactivado en entorno de producción");
      this.server = null;
    }
  }

  async savePhoto(file: File, id: DeviceId): Promise<URL> {
    const extension = this.getFileExtension(file)
    if (!extension) return Promise.reject()

    const filename = `${id}.${extension}`

    const path = `${BASE_PATH}/${filename}`

    await Bun.write(path, file)

    // En producción, la URL base debería venir de una variable de entorno
    const productionBaseUrl = process.env.PHOTO_BASE_URL || `http://localhost:${MEDIA_PORT}/photo/`;
    const baseUrl = isDevelopment ? BASE_URL : productionBaseUrl;
    
    return new URL(filename, baseUrl)
  }

  getFileExtension(file: File): string | undefined {
    const parts = file.name.split('.');

    if (parts.length > 1) {
      return parts.pop();
    }

    return undefined;
  }
}