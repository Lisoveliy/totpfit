export function decodeVarint(buffer, offset) {
  let res = this.BigInt(0);
  let shift = 0;
  let byte = 0;

  do {
    if (offset >= buffer.length) {
      throw new RangeError("Index out of bound decoding varint");
    }

    byte = buffer[offset++];

    const multiplier = this.BigInt(2) ** this.BigInt(shift);
    const thisByteValue = this.BigInt(byte & 0x7f) * multiplier;
    shift += 7;
    res = res + thisByteValue;
  } while (byte >= 0x80);

  return {
    value: res,
    length: shift / 7
  };
}
