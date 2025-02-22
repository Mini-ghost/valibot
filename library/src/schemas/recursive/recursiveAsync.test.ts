import { describe, expect, test, vi } from 'vitest';
import { parseAsync } from '../../methods/index.ts';
import { minLength } from '../../validations/index.ts';
import { stringAsync } from '../string/index.ts';
import { recursiveAsync } from './recursiveAsync.ts';

describe('recursiveAsync', () => {
  test('should pass only getter schema', async () => {
    const schema = recursiveAsync(() => stringAsync([minLength(3)]));
    const input = 'hello';
    const output = await parseAsync(schema, input);
    expect(output).toBe(input);
    await expect(parseAsync(schema, 'he')).rejects.toThrowError();
    await expect(parseAsync(schema, 123n)).rejects.toThrowError();
    await expect(parseAsync(schema, null)).rejects.toThrowError();
    await expect(parseAsync(schema, {})).rejects.toThrowError();
  });

  test('should pass input to getter', async () => {
    const getter = vi.fn().mockReturnValue({ _parse: stringAsync()._parse });
    const schema = recursiveAsync(getter);
    const input = 'hello';
    await parseAsync(schema, input);
    expect(getter).toHaveBeenCalledWith(input);
  });
});
