export function testLoaded(imgs) {
    for (const [filename, img] of Object.entries(imgs)) {
        console.log(`${filename}: ${img.complete && img.naturalWidth !== 0 ? "Success" : "Failure"}`);
    }
}
