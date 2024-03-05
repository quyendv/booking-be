export class PaymentUtils {
  static sortAndEncodeObject(obj: Record<string, any>): Record<string, string> {
    const sorted: Record<string, string> = {};
    const encodedList: string[] = [];

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        encodedList.push(encodeURIComponent(key));
      }
    }
    encodedList.sort();
    for (const encodedItem of encodedList) {
      sorted[encodedItem] = encodeURIComponent(obj[encodedItem]).replace(/%20/g, '+'); // space to +
    }
    return sorted;
  }
}
