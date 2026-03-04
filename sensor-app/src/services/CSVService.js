import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';


function convertToCSV(rows) {

  if (!rows || rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [];

  csvRows.push(headers.join(","));

  for (const row of rows) {

    const values = headers.map(header => {

      const value = row[header];

      if (value === null || value === undefined) {
        return "";
      }

      return value;

    });

    csvRows.push(values.join(","));

  }

  return csvRows.join("\n");

}


function generateFilename(busNumber) {

  const now = new Date();

  const date = now.toISOString().split("T")[0];

  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-");

  return `transport_bus_${busNumber}_${date}_${time}.csv`;

}


export async function saveCSV(rows, busNumber) {

  try {

    const csv = convertToCSV(rows);

    const filename = generateFilename(busNumber);

    await Filesystem.writeFile({

      path: filename,

      data: csv,

      directory: Directory.Documents,

      encoding: Encoding.UTF8

    });

    return filename;

  }
  catch (error) {

    console.error(error);

    throw error;

  }

}