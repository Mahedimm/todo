export class Constants {
    public static ACCESS_TOKEN      = 'accessToken';
    public static REFRESH_TOKEN     = 'refreshToken';
    public static LOCAL_CART        = 'localCart';
    public static AUTH_TYPE         = {basic: "basic", bearer: "bearer"};
    public static USER_INFO         = 'userInfo';

    // static S3_BUCKET_NAME       = '';
    // static S3_DIR_NAME          = '';
    // static S3_REGION            = '';
    // static S3_ACCESS_KEY_ID     = '';
    // static S3_ACCESS_KEY_SECRET = '';
    //

    public static CLIENT_ID         = 'demo-client';
    public static CLIENT_SECRET     = 'demo-secret';
    public static BASE_ENDPOINT     = 'http://localhost:3333/front-end/';

    public static AUTH_ENDPOINT = 'auth';
    public static UTILITIES     = 'utilities';
    public static TODO          = 'todo';

    public static GENDERS = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
    ]
}
