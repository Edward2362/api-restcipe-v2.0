import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationController } from "../../src/Controllers/Authentication/authentication.controller";
import { AuthenticationService } from "../../src/Services/Authentication/authentication.service";
import { AuthenticationDTO } from "../../src/Models/Customer/authentication.dto";
import { CustomerResponse } from "../../src/Models/Customer/customer-response.model";
import { MessageResponse } from "../../src/Models/MessageResponse/message-response.model";
import { HttpStatus, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/mongoose";
import { Customer } from "../../src/Models/Customer/customer.schema";

describe("AuthenticationController", () => {
    let authenticationService: AuthenticationService;
    let authenticationController: AuthenticationController;

    const mockCustomerModel = {
        findOne: jest.fn(),
        create: jest.fn(),
        exec: jest.fn()
    };
    
    const mockJwtService = {
        signAsync: jest.fn()
    };
    
    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [AuthenticationService, {
                provide: getModelToken(Customer.name),
                useValue: mockCustomerModel
            }, 
            {
                provide: JwtService,
                useValue: mockJwtService
            }]
        }).compile();

        authenticationService = testingModule.get<AuthenticationService>(AuthenticationService);
        authenticationController = testingModule.get<AuthenticationController>(AuthenticationController);
    });

    describe("register", () => {
        it("register and return customer data", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            const mockCustomerResponse: CustomerResponse = {
                customerEmail: authenticationDTO.customerEmail,
                customerFirstName: "",
                customerLastName: "",
                token: ""
            } as CustomerResponse;

            const mockMessageResponse: MessageResponse<CustomerResponse> = {
                statusCode: HttpStatus.OK,
                data: mockCustomerResponse,
                message: ""
            } as MessageResponse<CustomerResponse>;
            
            jest.spyOn(authenticationService, "register").mockImplementationOnce(() => {
                return Promise.resolve(mockCustomerResponse);
            });

            const messageResponse: MessageResponse<CustomerResponse> = await authenticationController.register(authenticationDTO);

            expect(messageResponse).toEqual(mockMessageResponse);
        });

        it("get bad request exception for missing email input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerPassword: "unknown"
            } as AuthenticationDTO;

            await expect(authenticationController.register(authenticationDTO)).rejects.toThrow(BadRequestException);
        });

        it("get bad request exception for missing password input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown"
            } as AuthenticationDTO;

            await expect(authenticationController.register(authenticationDTO)).rejects.toThrow(BadRequestException);
        });
    });

    describe("login", () => {
        it("login and return customer data", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown",
                customerPassword: "unknown"
            } as AuthenticationDTO;

            const mockCustomerResponse: CustomerResponse = {
                customerEmail: authenticationDTO.customerEmail,
                customerFirstName: "",
                customerLastName: "",
                token: ""
            } as CustomerResponse;

            const mockMessageResponse: MessageResponse<CustomerResponse> = {
                statusCode: HttpStatus.OK,
                data: mockCustomerResponse,
                message: ""
            } as MessageResponse<CustomerResponse>;

            jest.spyOn(authenticationService, "login").mockImplementationOnce(() => {
                return Promise.resolve(mockCustomerResponse);
            });

            const messageResponse: MessageResponse<CustomerResponse> = await authenticationController.login(authenticationDTO);

            expect(messageResponse).toEqual(mockMessageResponse);
        });

        it("get bad request exception for missing email input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerPassword: "unknown"
            } as AuthenticationDTO;

            await expect(authenticationController.login(authenticationDTO)).rejects.toThrow(BadRequestException);
        });

        it("get bad request exception for missing password input", async () => {
            const authenticationDTO: AuthenticationDTO = {
                customerEmail: "unknown"
            } as AuthenticationDTO;

            await expect(authenticationController.login(authenticationDTO)).rejects.toThrow(BadRequestException);
        });
    });
});