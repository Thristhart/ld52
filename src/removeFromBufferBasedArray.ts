import { DecodedBuffer, Descriptor } from "buffer-backed-object/buffer-backed-object";

export function removeFromBufferBasedArray(
    array: Array<DecodedBuffer<{ type: Descriptor<number> }>>,
    deleteIndex: number
) {
    let lastIndex = getLastItemInArrayAfter(array, deleteIndex);
    copyObject(array[deleteIndex], array[lastIndex]);
    array[lastIndex].type = 0;
}

function copyObject(toObject: {}, fromObject: {}) {
    for (const key in fromObject) {
        const typedKey = key as keyof typeof fromObject;
        if (Array.isArray(fromObject[typedKey])) {
            copyArray(toObject[typedKey], fromObject[typedKey]);
        } else if (typeof fromObject[typedKey] === "object") {
            copyObject(toObject[typedKey], fromObject[typedKey]);
        } else {
            toObject[typedKey] = fromObject[typedKey];
        }
    }
}

function copyArray(toArray: [], fromArray: []) {
    for (let i = 0; i < fromArray.length; i++) {
        if (Array.isArray(fromArray[i])) {
            copyArray(toArray[i], fromArray[i]);
        } else if (typeof fromArray[i] === "object") {
            copyObject(toArray[i], fromArray[i]);
        } else {
            toArray[i] = fromArray[i];
        }
    }
}

function getLastItemInArrayAfter(array: Array<DecodedBuffer<{ type: Descriptor<number> }>>, index: number) {
    let lastIndex = index;
    while (lastIndex + 1 < array.length && array[lastIndex + 1].type != 0) {
        lastIndex++;
    }
    return lastIndex;
}
