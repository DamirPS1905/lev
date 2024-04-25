import { Injectable, Optional, HttpStatus, ArgumentMetadata, PipeTransform, HttpException, ParseIntPipeOptions } from '@nestjs/common'


@Injectable()
export class ParseBigIntPipe implements PipeTransform<string> {
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() protected readonly options?: ParseIntPipeOptions) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      (error => new HttpException(error, HttpStatus.BAD_REQUEST));
  }

  async transform(value: string, metadata: ArgumentMetadata): Promise<bigint> {
    if (value ===null && this.options?.optional) {
      return null;
    }
    if (value===undefined && this.options?.optional) {
      return undefined;
    }
    const val = BigInt(value);
    if (value!==val.toString()) {
      throw this.exceptionFactory(
        'Validation failed (bigint numeric string is expected)',
      );
    }
    return val;
  }
  
}