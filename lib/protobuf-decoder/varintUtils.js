"use bigint"
export function decodeVarint(buffer, offset) {
  let res = BigInt(0);
  let shift = 0;
  let byte = 0;

  do {
    if (offset >= buffer.length) {
      throw new RangeError("Index out of bound decoding varint");
    }

    byte = buffer[offset++];

    const multiplier = exponentiate(BigInt(2), BigInt(shift));
    const thisByteValue = multiply(BigInt(byte & 0x7f), multiplier);
    shift += 7;
    res = add(res, thisByteValue);
  } while (byte >= 0x80);

  return {
    value: res,
    length: shift / 7
  };
}
