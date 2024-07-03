import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';
import {
  CloudWatchDimensionName,
  CloudWatchDimensionsUnit,
  CloudWatchMetricName,
} from './enums/enums';
import {
  IncreaseErrorMetricException,
  IncreaseFunctionMetricException,
} from './exceptions/GeneralException';

export class CloudWatchLogger {
  private static instance: CloudWatchLogger;
  private cloudWatchClient: CloudWatchClient;
  private projectName: string;
  private stage: string;

  private constructor(region: string, projectName: string, stage: string) {
    this.projectName = projectName;
    this.stage = stage;
    this.cloudWatchClient = new CloudWatchClient({ region });
  }

  public static getInstance(
    region: string = 'us-east-1',
    projectName: string = 'CustomProjectMetrics',
    stage: string = 'development'
  ): CloudWatchLogger {
    if (!CloudWatchLogger.instance) {
      CloudWatchLogger.instance = new CloudWatchLogger(
        region,
        projectName,
        stage
      );
    }

    return CloudWatchLogger.instance;
  }

  public async increaseFunctionMetricCount(
    functionName: string
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: CloudWatchMetricName.FUNCTION_INVOCATION,
            Dimensions: [
              {
                Name: CloudWatchDimensionName.FUNCTION_NAME,
                Value: functionName,
              },
            ],
            Value: 1,
            Unit: CloudWatchDimensionsUnit.COUNT,
          },
        ],
        Namespace: `${this.projectName}/${this.stage}/Functions`,
      });
      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new IncreaseFunctionMetricException(error as Error);
    }
  }

  public async increaseErrorMetricCount(
    functionName: string,
    errorType: string
  ): Promise<void> {
    try {
      const command = new PutMetricDataCommand({
        MetricData: [
          {
            MetricName: CloudWatchMetricName.FUNCTION_ERROR,
            Dimensions: [
              {
                Name: CloudWatchDimensionName.FUNCTION_NAME,
                Value: functionName,
              },
              {
                Name: CloudWatchDimensionName.ERROR_TYPE,
                Value: errorType,
              },
            ],
            Unit: CloudWatchDimensionsUnit.COUNT,
            Value: 1.0,
          },
        ],
        Namespace: `${this.projectName}/${this.stage}/Errors`,
      });

      await this.cloudWatchClient.send(command);
    } catch (error) {
      throw new IncreaseErrorMetricException(error as Error);
    }
  }
}
