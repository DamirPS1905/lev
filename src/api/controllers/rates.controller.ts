import { Get, HttpException, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { GenRatesController } from './gen/rates.controller';

export class RatesController extends GenRatesController {
  @Get('/:source/:from-to-:to')
  @ApiOperation({ summary: 'Получение курса валюты from по отношению к валюте to по информаци из источника source' })
  @ApiParam({ name: 'source', description: 'ID источника курсов валют' })
  @ApiParam({ name: 'from', description: 'Трехбуквенный код валюты' })
  @ApiParam({ name: 'to', description: 'Трехбуквенный код валюты' })
  async findOne(
    @AuthInfo() actor: Actors,
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('source', ParseIntPipe) sourceId: number,
  ) {
    if (from === to) return 1;
    const fromCurrency = await this.currenciesService.findByKey(from.toUpperCase()),
      toCurrency = await this.currenciesService.findByKey(to.toUpperCase()),
      source = await this.ratesSourcesService.findById(sourceId);
    if (fromCurrency === null) {
      throw new HttpException('Curreny ' + from + ' not found', HttpStatus.NOT_FOUND);
    }
    if (toCurrency === null) {
      throw new HttpException('Curreny ' + to + ' not found', HttpStatus.NOT_FOUND);
    }
    if (source === null) {
      throw new HttpException('Source not found', HttpStatus.NOT_FOUND);
    }
    let rate = 1;
    if (fromCurrency.id !== source.baseCurrency.id) {
      const toBase = await this.ratesService.findByFromAndToAndSource(
        fromCurrency.id,
        source.baseCurrency.id,
        source.id,
      );
      if (toBase === null) {
        throw new HttpException('Unable detrminate rate using current source', HttpStatus.NOT_FOUND);
      }
      rate *= parseFloat(toBase.rate);
    }
    if (toCurrency.id !== source.baseCurrency.id) {
      const fromBase = await this.ratesService.findByFromAndToAndSource(
        source.baseCurrency.id,
        toCurrency.id,
        source.id,
      );
      if (fromBase === null) {
        throw new HttpException('Unable detrminate rate using current source', HttpStatus.NOT_FOUND);
      }
      rate *= parseFloat(fromBase.rate);
    }
    return rate;
  }
}
