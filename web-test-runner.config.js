export default {
  testRunnerHtml: testFramework =>
    `<html>
      <head>
        <link rel="stylesheet" href="/dist/themes/base.css">
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`
};
