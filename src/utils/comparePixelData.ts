// 比较两个像素数据是否相同
export function comparePixelData(data1: any, data2: any) {
    if (data1.width !== data2.width || data1.height !== data2.height) {
        return false;
    }

    const buffer1 = data1.data;
    const buffer2 = data2.data;

    // 可以设置一个容差值，因为浮点数精度问题可能导致轻微差异
    const tolerance = 5;

    for (let i = 0; i < buffer1.length; i++) {
        if (Math.abs(buffer1[i] - buffer2[i]) > tolerance) {
            return false;
        }
    }

    return true;
}