import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { logger } from '../../shared/logger.js';
import { compressString } from '../llmlingua2/compress.js';
import type { ProcessedFile } from './fileTypes.js';

export const postProcessContent = async (
  preProcessedFile: ProcessedFile,
  config: RepomixConfigMerged,
): Promise<string> => {
  let postProcessedContent = preProcessedFile.content;

  if (config.output.compressWithLLMLingua2) {
    try {
      const compressedContent = await compressString(preProcessedFile.content);
      if (compressedContent === undefined) {
        logger.trace('Error compressing content with LLMLingua2. Using original content.');
      }
      postProcessedContent = compressedContent ?? postProcessedContent;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Error parsing ${preProcessedFile.path} in compressed mode: ${message}`);
      //re-throw error
      throw error;
    }
  }

  return postProcessedContent;
};
