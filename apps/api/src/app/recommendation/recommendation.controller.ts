import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ExternalSubscriberId, IJwtPayload, TopicKey } from '@novu/shared';

import { NodeTranslationDto, NodeTranslationResponseDto } from './dtos';
import {
  UseChatGptUseCase,
  UseChatGptCommand,
  GetNodeContentUseCase,
  GetNodeContentCommand,
  GetNotificationPromptSuggestionUseCase,
  GetNotificationPromptSuggestionCommand,
  GetNodeTranslationUseCase,
  GetNodeTranslationCommand,
} from './use-cases';
import { JwtAuthGuard } from '../auth/framework/auth.guard';
import { ExternalApiAccessible } from '../auth/framework/external-api.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { ApiResponse } from '../shared/framework/response.decorator';
import { GetModuleTestDto } from './dtos/get-module-test.dto';
import { UseChatGptDto, UseChatGptResponseDto } from './dtos/use-chat-gpt.dto';
import { GetNodeContentDto, GetNodeContentResponseDto } from './dtos/get-node-content.dto';

@Controller('/recommend')
@ApiTags('Recommendation')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  constructor(
    private useChatGptUseCase: UseChatGptUseCase,
    private getNodeContentUseCase: GetNodeContentUseCase,
    private getNotificationPromptSuggestionUseCase: GetNotificationPromptSuggestionUseCase,
    private getNodeTranslationUseCase: GetNodeTranslationUseCase
  ) {}

  @Post('/open-ai')
  @ExternalApiAccessible()
  @ApiResponse(GetModuleTestDto)
  @ApiOperation({ summary: 'Get an Open AI text', description: 'Get an Open AI text' })
  async createTopic(@UserSession() user: IJwtPayload, @Body() body: UseChatGptDto): Promise<UseChatGptResponseDto> {
    console.log('body.prompt', body.prompt);
    const answer = await this.useChatGptUseCase.execute(
      UseChatGptCommand.create({
        environmentId: user.environmentId,
        prompt: body.prompt,
        organizationId: user.organizationId,
      })
    );

    return {
      answer,
    };
  }

  @Post('/get-node-contet')
  @ExternalApiAccessible()
  @ApiResponse(GetModuleTestDto)
  @ApiOperation({ summary: 'Get an Open AI text', description: 'Get an Open AI text' })
  async getNodeContent(
    @UserSession() user: IJwtPayload,
    @Body() body: GetNodeContentDto
  ): Promise<GetNodeContentResponseDto> {
    const answer = await this.getNodeContentUseCase.execute(
      GetNodeContentCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        ...body,
      })
    );

    return {
      answer,
    };
  }

  @Post('/notification-prompt-suggestion')
  @ExternalApiAccessible()
  @ApiResponse(GetModuleTestDto)
  @ApiOperation({ summary: 'Get an Open AI text', description: 'Get an Open AI text' })
  async notificationPromptSuggestion(
    @UserSession() user: IJwtPayload,
    @Body() body: UseChatGptDto
  ): Promise<GetNodeContentResponseDto> {
    const answer = await this.getNotificationPromptSuggestionUseCase.execute(
      GetNotificationPromptSuggestionCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        prompt: body.prompt,
        limit: 10,
      })
    );

    return {
      answer,
    };
  }
  @Post('/get-node-translation')
  @ExternalApiAccessible()
  @ApiResponse(GetModuleTestDto)
  @ApiOperation({ summary: 'Get an Open AI text', description: 'Get an Open AI text' })
  async getNodeContentTranslation(
    @UserSession() user: IJwtPayload,
    @Body() body: NodeTranslationDto
  ): Promise<NodeTranslationResponseDto> {
    const answer = await this.getNodeTranslationUseCase.execute(
      GetNodeTranslationCommand.create({
        environmentId: user.environmentId,
        organizationId: user.organizationId,
        prompt: body.prompt,
        dstLanguage: body.dstLanguage,
      })
    );

    return {
      answer,
    };
  }
}
