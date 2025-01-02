const awsExports = {
    aws_project_region: "us-east-1",
    aws_cognito_region: "us-east-1",
    aws_user_pools_id: "us-east-1_sahtrEFaC",
    aws_user_pools_web_client_id: "1a8epivuqub56fq7lamf10g8vr",

    aws_oauth: {
        domain: "https://us-east-1sahtrefac.auth.us-east-1.amazoncognito.com",
        scope: ["email", "openid", "profile"],
        redirectSignIn: "http://localhost:5173/",
        redirectSignOut: "http://localhost:5173/",
        responseType: "code", // Utiliser "code" pour le flow Authorization Code
    },
};

export default awsExports;