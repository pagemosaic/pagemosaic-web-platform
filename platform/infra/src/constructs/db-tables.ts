import {Construct} from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {PLATFORM_PAGES_TABLE_NAME, PLATFORM_SYSTEM_TABLE_NAME} from 'common-utils';

export class DbTablesConstruct extends Construct {
    public readonly tables: Array<dynamodb.Table>;

    constructor(scope: Construct, id: string) {
        super(scope, id);
        this.tables = [];

        this.tables.push(new dynamodb.Table(this, PLATFORM_PAGES_TABLE_NAME, {
                tableName: PLATFORM_PAGES_TABLE_NAME,
                partitionKey: {name: 'PK', type: dynamodb.AttributeType.STRING},
                sortKey: {name: 'SK', type: dynamodb.AttributeType.STRING},
                billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
            })
        );
        this.tables.push(new dynamodb.Table(this, PLATFORM_SYSTEM_TABLE_NAME, {
                tableName: PLATFORM_SYSTEM_TABLE_NAME,
                partitionKey: {name: 'PK', type: dynamodb.AttributeType.STRING},
                sortKey: {name: 'SK', type: dynamodb.AttributeType.STRING},
                billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Use on-demand billing mode
            })
        );
        // // Store the table name in AWS Systems Manager Parameter Store
        // new ssm.StringParameter(this, 'ProbeTableNameParameter', {
        //     parameterName: 'probe-table-name',
        //     stringValue: this.table.tableName,
        // });
    }
}
