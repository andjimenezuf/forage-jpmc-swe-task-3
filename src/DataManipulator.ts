import { ServerRespond } from './DataStreamer';
//This file is responsible for processing the raw stock data we receive from the server
//before the Graph component renders it.
export interface Row {
    price_abc: number,
    price_def: number,
    ratio: number,
    timestamp: Date,
    upper_bound: number,
    lower_bound: number,
    trigger_alert: number | undefined,
}


export class DataManipulator {
  //the return value is changed from an array of Row objects to just
  //a single Row object This change explains why we also adjusted the argument
  //we passed to table.update
  static generateRow(serverRespond: ServerRespond[]): Row {
      const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
      const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
      const ratio = priceABC / priceDEF;
      const upperBound = 1 + 0.10;
      const lowerBound = 1 - 0.12;
      return {
          price_abc: priceABC,
          price_def: priceDEF,
          ratio,
          timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
              serverRespond[0].timestamp : serverRespond[1].timestamp,
          upper_bound: upperBound,
          lower_bound: lowerBound,
          trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };
  }
}
