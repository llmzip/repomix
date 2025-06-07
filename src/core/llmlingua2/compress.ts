import { LLMLingua2 } from '@atjsh/llmlingua-2';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

let promptCompressorSingleton: LLMLingua2.PromptCompressor | null = null;
const oai_tokenizer = new Tiktoken(o200k_base);

export const compressString = async (content: string, rate = 96, device?: string): Promise<string> => {
  const promptCompressor = await getPromptCompressorSingleton(device);

  const compressedContent = await promptCompressor.compress_prompt(content, {
    rate: rate / 100,
    force_reserve_digit: true,
  });

  return compressedContent;
};

function parseDevice(device?: string): 'webgpu' | 'cpu' | 'auto' {
  if (device === 'webgpu' || device === 'cpu' || device === 'auto') {
    return device;
  }
  return 'auto';
}

const getPromptCompressorSingleton = async (device?: string) => {
  if (!promptCompressorSingleton) {
    const { promptCompressor } = await LLMLingua2.WithBERTMultilingual(
      'atjsh/llmlingua-2-js-xlm-roberta-large-meetingbank',
      {
        device: parseDevice(device),
        dtype: 'fp32',
      },
      oai_tokenizer,
      {
        modelSpecificOptions: {
          use_external_data_format: true,
        },
      },
    );

    promptCompressorSingleton = promptCompressor;
  }

  return promptCompressorSingleton;
};
