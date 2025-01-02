const awsExports = {
    aws_project_region: "us-east-1",
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: "us-east-1_dPcrWhITD",
    aws_user_pools_web_client_id: "1liacg9jp34solfc7hg2fsm65e",
    // aws_user_pools_web_client_id: "1c0frmf7rnc1nmpmvnuqvs4f7h",
    aws_oauth: {
        domain: "https://us-east-1dpcrwhitd.auth.us-east-1.amazoncognito.com",
        scope: ["email", "openid", "profile"],
        redirectSignIn: "http://localhost:5173/",
        redirectSignOut: "http://localhost:5173/",
        //redirectSignIn: "https://main.dn3peglnl93ce.amplifyapp.com/?code=07fc52ad-71d1-4a0a-88a4-a899661782c1",
        //redirectSignOut: "https://main.dn3peglnl93ce.amplifyapp.com/?code=07fc52ad-71d1-4a0a-88a4-a899661782c1",
        responseType: "code", // Utiliser "code" pour le flow Authorization Code
    },
};

export default awsExports;
