import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { Duration } from 'luxon';

import DbConnector from "./DbConnector"

export default class DeleteMailsOlderThanRequestHandler {

    private dbConnector: DbConnector

    private constructor( dbConnector: DbConnector ) {
        this.dbConnector = dbConnector;
    }

    private handleRequest(req: Request, res: Response, next: NextFunction) {

        const duration = Duration.fromISO(req.params.isoduration);
        if( ! duration.isValid ) {
            throw new Error('invalid date:' + duration.invalidExplanation )
        }
        this.dbConnector.deleteMailsOlderThan(duration)
          .then( rowCount => {
            res.sendStatus(rowCount ? 200 : 204);
          })
          .catch(next);
    }

    static create(dbConnector: DbConnector): (req: Request, res: Response, next: NextFunction) => void {
        const returned = new DeleteMailsOlderThanRequestHandler( dbConnector );
        return returned.handleRequest.bind(returned);
    }
}