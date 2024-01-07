import { applyDecorators, Type } from "@nestjs/common";
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { MessageResponse } from "../../../Models/MessageResponse/message-response.model";

export const ApiOkMessageResponse = <DataType extends Type<unknown>>(dataType: DataType) => {
    return applyDecorators(ApiExtraModels(MessageResponse, dataType), ApiOkResponse({
        schema: {
            allOf: [
                {$ref: getSchemaPath(MessageResponse)},
                {
                    properties: {
                        data: {
                            type: "object",
                            $ref: getSchemaPath(dataType)
                        }
                    }
                }
            ]
        }
    }));
};