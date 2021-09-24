// This is a JavaScript module that is loaded on demand. It can export any number of
// functions, and may import other JavaScript modules if required.

export function downloadFile(byteArray, name, mimeType) {
    // Convert base64 string to numbers array.
    const numArray = atob(byteArray).split('').map(c => c.charCodeAt(0));

    var file = new File([new Uint8Array(numArray)], name, { type: mimeType })

    var link = document.createElement('a');
    link.download = name;
    link.href = URL.createObjectURL(file);
    link.click();
    link.remove();
    URL.revokeObjectURL(file);
}
