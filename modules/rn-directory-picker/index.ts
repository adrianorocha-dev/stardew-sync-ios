import RnDirectoryPickerModule from "./src/RnDirectoryPickerModule";

export async function pickFolder() {
  try {
    const folderPath = await RnDirectoryPickerModule.pickFolder();
    console.log("Selected folder:", folderPath);
  } catch (e) {
    console.error("Error picking folder:", e);
  }
}
