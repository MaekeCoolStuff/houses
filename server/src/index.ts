import express from 'express';
const app = express();

app.get('/', (req, res) => res.send('Express + TypeScript Server'));
app.listen(process.env.PORT, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.PORT}`
  );
});
