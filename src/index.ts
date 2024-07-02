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

let cloudWatchClient: CloudWatchClient;
let projectName: string;
let stage: string;

export const initializeLogger = (
  region: string = 'us-east-1',
  projectName: string = 'DefaultMetrics',
  stage: string = 'development'
) => {
  cloudWatchClient = new CloudWatchClient({ region });
  projectName = projectName;
  stage = stage;
};

export async function increaseFunctionMetricCount(
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
      Namespace: `${projectName}/${stage}/Functions`,
    });
    await cloudWatchClient.send(command);
  } catch (error) {
    throw new IncreaseFunctionMetricException(error as Error);
  }
}

export async function increaseErrorMetricCount(
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
      Namespace: `${projectName}/${stage}/Errors`,
    });

    await cloudWatchClient.send(command);
  } catch (error) {
    throw new IncreaseErrorMetricException(error as Error);
  }
}
