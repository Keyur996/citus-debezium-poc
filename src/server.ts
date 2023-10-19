import hpp from 'hpp';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import Logger from 'bunyan';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import express, {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
  Router
} from 'express';
import { FRONT_URL, PORT } from './config';
import { createLogger } from './util';
import { CustomError, IErrorResponse } from './helper/error-helper';

const log: Logger = createLogger('server');

export type Routes = {
  router: Router;
  path: string;
};

export class ChattyServer {
  private readonly app: Application;
  private readonly routes: Routes[];

  constructor(routes: Routes[]) {
    this.app = express();
    this.routes = routes;
  }

  public start(): void {
    this.securityMiddleware();
    this.standardMiddleware();
    this.routesMiddleware();
    this.globalErrorHandler();
    this.startServer();
  }

  private securityMiddleware(): void {
    this.app.set('trust proxy', 1);
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: FRONT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );
  }

  private standardMiddleware(): void {
    this.app.use(compression());
    this.app.use(json({ limit: '50mb' }));
    this.app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routesMiddleware(): void {
    this.routes.forEach((route) => {
      this.app.use('', route.router);
    });
  }

  private globalErrorHandler(): void {
    this.app.all('*', (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    this.app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        log.error(error);
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        next();
      }
    );
  }

  private async startServer(): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(this.app);
      this.startHttpServer(httpServer);
    } catch (error) {
      log.error(error);
    }
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`Worker with process id of ${process.pid} has started...`);
    log.info(`Server has started with process ${process.pid}`);
    httpServer.listen(PORT, () => {
      log.info(`Server running on port ${PORT}`);
    });
  }
}
