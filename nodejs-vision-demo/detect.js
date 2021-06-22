
'use strict';

async function detectLabels(fileName) {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the local file

  // Backup
  /*const [result] = await client.labelDetection(fileName);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description, label.score));*/

  client
      .labelDetection(fileName)
      .then(results => {
        const labels = results[0].labelAnnotations;

        console.log('Labels:');
        labels.forEach(label => console.log(label.description, label.score));
      })
      .catch(err => {
        console.error('ERROR:', err);
      });
}

async function detectLabelsGCS(bucketName, fileName) {
  // Imports the Google Cloud client libraries
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the gcs file
  const [result] = await client.labelDetection(
    `gs://${bucketName}/${fileName}`
    );
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
}

require(`yargs`) // eslint-disable-line
  .demand(1)
  .command(
    `labels <fileName>`,
    `Detects labels in a local image file.`,
    {},
    opts => detectLabels(opts.fileName)
  )
  .command(
    `labels-gcs <bucketName> <fileName>`,
    `Detects labels in an image in Google Cloud Storage.`,
    {},
    opts => detectLabelsGCS(opts.bucketName, opts.fileName)
  )
  .example(`node $0 labels ./resources/wakeupcat.jpg`)
  .example(`node $0 labels-gcs my-bucket your-image.jpg`)
  .wrap(120)
  .recommendCommands()
  .epilogue(`For more information, see https://cloud.google.com/vision/docs`)
  .help()
  .strict().argv;