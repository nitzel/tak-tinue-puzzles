// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// better-sqlite3 on worker threats for slow queries: https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/threads.md

import { NextApiRequest, NextApiResponse } from "next";

export type Result = { puzzleUrl: string };

export default async (req: NextApiRequest, res: NextApiResponse<Result>) => {
  res.status(200).json({
    puzzleUrl: "https://ptn.ninja/NoZQlgLgpgBARABQDYEMCeAVFBrAdAYwHsBbOAXQFgAoYAUQDcoA7CeAeSaTCdmXXOrAAwkkL5s8AIwBWAFwAGGAGoAzPIE0ASlADOAVySs48gLSaNoMAC9YcAGwWMCEFIA0AD2kB6SR+++A118AJg8vdyDXYODfCND3L1DomKjU+MSPKKEPFRhgmEkAFgsAERRoeGD5GNxq3El1ShoMMGJbaIU7WRUADg1qItwgA&name=CIQwlgNgngBACgVwF5IgUxgYgBwHYB0AzDABQCiIAzlAJRA&playSpeed=40&turnIndicator=false&pieceShadows=false",
  });
}
