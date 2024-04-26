import { classToClass } from '@nestjs/class-transformer';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        console.log('before');
        console.log(data);
        const nd = classToClass(data);
        console.log('after');
        console.log(nd);
        return nd;
      }),
    );
  }
}
