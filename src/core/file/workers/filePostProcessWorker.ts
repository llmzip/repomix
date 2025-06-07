import type { RepomixConfigMerged } from '../../../config/configSchema.js';
import { setLogLevelByEnv } from '../../../shared/logger.js';
import { postProcessContent } from '../filePostProcessContent.js';
import type { PostProcessedFile, ProcessedFile } from '../fileTypes.js';

export interface FilePostProcessTask {
  preProcessedFile: ProcessedFile;
  config: RepomixConfigMerged;
}

// Set logger log level from environment variable if provided
setLogLevelByEnv();

export default async ({ preProcessedFile, config }: FilePostProcessTask): Promise<PostProcessedFile> => {
  const postProcessedContent = await postProcessContent(preProcessedFile, config);
  return {
    path: preProcessedFile.path,
    content: postProcessedContent,
  };
};
