#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const fovus_cdk_stack_1 = require("../lib/fovus-cdk-stack");
const app = new cdk.App();
new fovus_cdk_stack_1.FovusCdkStack(app, 'FovusCdkStack', {
    // env: {
    // account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    // region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION,
    // },
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere.
     */
    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration.
     */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to.
     */
    env: { account: '851725482613', region: 'us-east-1' },
    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm92dXMtY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZm92dXMtY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFtQztBQUNuQyw0REFBdUQ7QUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSwrQkFBYSxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7SUFDdEMsU0FBUztJQUNULDhFQUE4RTtJQUM5RSwyRUFBMkU7SUFDM0UsS0FBSztJQUNMOzs7T0FHRztJQUVIOztPQUVHO0lBQ0gsNkZBQTZGO0lBRTdGOztPQUVHO0lBQ0gsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO0lBRXJELDhGQUE4RjtDQUMvRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiB0cy1ub2RlXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgRm92dXNDZGtTdGFjayB9IGZyb20gJy4uL2xpYi9mb3Z1cy1jZGstc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IEZvdnVzQ2RrU3RhY2soYXBwLCAnRm92dXNDZGtTdGFjaycsIHtcbiAgLy8gZW52OiB7XG4gIC8vIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERVBMT1lfQUNDT1VOVCB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAvLyByZWdpb246IHByb2Nlc3MuZW52LkNES19ERVBMT1lfUkVHSU9OIHx8IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTixcbiAgLy8gfSxcbiAgLyogSWYgeW91IGRvbid0IHNwZWNpZnkgJ2VudicsIHRoaXMgc3RhY2sgd2lsbCBiZSBlbnZpcm9ubWVudC1hZ25vc3RpYy5cbiAgICogQWNjb3VudC9SZWdpb24tZGVwZW5kZW50IGZlYXR1cmVzIGFuZCBjb250ZXh0IGxvb2t1cHMgd2lsbCBub3Qgd29yayxcbiAgICogYnV0IGEgc2luZ2xlIHN5bnRoZXNpemVkIHRlbXBsYXRlIGNhbiBiZSBkZXBsb3llZCBhbnl3aGVyZS5cbiAgICovXG5cbiAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgdG8gc3BlY2lhbGl6ZSB0aGlzIHN0YWNrIGZvciB0aGUgQVdTIEFjY291bnRcbiAgICogYW5kIFJlZ2lvbiB0aGF0IGFyZSBpbXBsaWVkIGJ5IHRoZSBjdXJyZW50IENMSSBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgLy8gZW52OiB7IGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIH0sXG5cbiAgLyogVW5jb21tZW50IHRoZSBuZXh0IGxpbmUgaWYgeW91IGtub3cgZXhhY3RseSB3aGF0IEFjY291bnQgYW5kIFJlZ2lvbiB5b3VcbiAgICogd2FudCB0byBkZXBsb3kgdGhlIHN0YWNrIHRvLlxuICAgKi9cbiAgZW52OiB7IGFjY291bnQ6ICc4NTE3MjU0ODI2MTMnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG5cbiAgLyogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9lbnZpcm9ubWVudHMuaHRtbCAqL1xufSk7Il19