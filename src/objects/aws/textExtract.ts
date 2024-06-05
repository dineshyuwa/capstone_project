import { 
    AnalyzeDocumentCommand, 
    AnalyzeExpenseCommand, 
    TextractClient, 
    FeatureType 
} from "@aws-sdk/client-textract";

export class ExtractTextService {
    private REGION = process.env.REGION;

    private textractClient = new TextractClient({
        region: this.REGION,
    });

    /**
     * Extracts plain text from the Textract response.
     * @param {any} response - The response from the Textract AnalyzeDocument operation.
     * @returns {string} - The extracted plain text.
     */
    private getPlainTextFromDocResponse(response: any): string {
        try {
            let content = '';
            response.Blocks.forEach((block: any) => {
                // Check if block contains text and concatenate it to content
                if ("Text" in block && block.Text !== undefined) {
                    content += `${block.Text}\n`;
                }
            });
            return content;
        } catch (err) {
            console.log("Error", err);
            return '';
        }
    }

    /**
     * Structures invoice data from the Textract AnalyzeExpense response.
     * @param {any} response - The response from the Textract AnalyzeExpense operation.
     * @returns {any} - The structured invoice data.
     */
    private structureInvoiceData(response: any): any {
        const structuredInvoiceData: any = {
            summary: {},
            lineItems: []
        };
        let i = 0;
    
        response.ExpenseDocuments.forEach((doc: any) => {
            doc.SummaryFields.forEach((item: any) => {
                let key = item.Type.Text;
                let value = item.ValueDetection.Text;
    
                const label = item.LabelDetection ? item.LabelDetection.Text : '';
    
                structuredInvoiceData.summary[key] = {
                    label: label,
                    value: value
                };
            });
    
            doc.LineItemGroups.forEach((group: any) => {
                group.LineItems.forEach((lineItem: any) => {
                    let lineItemObj: any = {};
    
                    lineItem.LineItemExpenseFields.forEach((field: any) => {
                        let fieldType = field.Type.Text;
                        let fieldValue = field.ValueDetection.Text;
    
                        lineItemObj[fieldType] = fieldValue;
                    });
    
                    structuredInvoiceData.lineItems.push(lineItemObj);
                });
            });
        });
    
        return structuredInvoiceData;
    }    

    /**
     * Retrieves plain text content from a document stored in an S3 bucket.
     * @param {string} bucketName - The name of the S3 bucket.
     * @param {string} filePath - The path to the file in the S3 bucket.
     * @returns {Promise<string>} - The extracted plain text content.
     */
    public async getDocumentContent(bucketName: string, filePath: string): Promise<string> {
        try {
            const params = {
                Document: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: filePath
                    },
                },
                FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS, FeatureType.SIGNATURES],
            };

            const analyzeDoc = new AnalyzeDocumentCommand(params);
            const response = await this.textractClient.send(analyzeDoc);
            const imgTextContent = this.getPlainTextFromDocResponse(response);

            return imgTextContent;
        } catch (err) {
            console.log("Error", err);
            return '';
        }
    }

    /**
     * Retrieves structured invoice content from a document stored in an S3 bucket.
     * @param {string} bucketName - The name of the S3 bucket.
     * @param {string} filePath - The path to the file in the S3 bucket.
     * @returns {Promise<any>} - The structured invoice data.
     */
    public async getInvoiceContent(bucketName: string, filePath: string): Promise<any> {
        try {
            const params = {
                Document: {
                    S3Object: {
                        Bucket: bucketName,
                        Name: filePath
                    },
                },
            };
            const analyzeExpense = new AnalyzeExpenseCommand(params);
            const response = await this.textractClient.send(analyzeExpense);

            const pdfTextContent = this.structureInvoiceData(response);

            return pdfTextContent;
        } catch (err) {
            console.log("Error", err);
            return null;
        }
    }
}
