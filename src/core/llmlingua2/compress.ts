import { LLMLingua2 } from '@atjsh/llmlingua-2';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

let promptCompressorSingleton: LLMLingua2.PromptCompressor | null = null;
const oai_tokenizer = new Tiktoken(o200k_base);

export const compressString = async (content: string): Promise<string> => {
  const promptCompressor = await getPromptCompressorSingleton();

  const compressedContent = await promptCompressor.compress_prompt(content, {
    rate: 0.96,
  });

  return compressedContent;
};

const getPromptCompressorSingleton = async () => {
  if (!promptCompressorSingleton) {
    const { promptCompressor } = await LLMLingua2.WithBERTMultilingual(
      'Arcoldd/llmlingua4j-bert-base-onnx',
      {
        device: 'auto',
        dtype: 'fp32',
      },
      oai_tokenizer,
      {
        modelSpecificOptions: {
          subfolder: '',
        },
      },
    );

    promptCompressorSingleton = promptCompressor;
  }

  return promptCompressorSingleton;
};
