import { Module } from '@nestjs/common';
import { Command, CommandFactory, CommandRunner, Option } from 'nest-commander';
import * as fs from 'fs';
import { resolve } from 'path';

interface CrudCommandOptions {
  permission?: boolean;
}

@Command({ name: 'crud', description: 'A parameter parse' })
export class CrudCommand extends CommandRunner {
  async run(passedParam: string[], options?: CrudCommandOptions): Promise<void> {
    if (options?.permission) {
      this.runWithoutPermission(passedParam);
    } else {
      await this.runCrud(passedParam, true);
    }
  }

  @Option({
    flags: '-p, --permission [permission]',
    description: 'a crud without permission',
  })
  async runWithoutPermission(param: string[]): Promise<void> {
    return this.runCrud(param);
  }

  async runCrud(param: string[], noPermission?: boolean): Promise<void> {
    const [name] = param;

    if (!name || name.length <= 2) {
      throw new Error('Please Provide A Name For Crud');
    }

    const ModuleName = this.generateModuleName(name);

    const path = resolve(__dirname + '../../../src/' + ModuleName);

    if (fs.existsSync(path)) {
      throw new Error('Directory exists!');
    }

    fs.mkdirSync(path);
    fs.writeFile(`${path}/${ModuleName}.module.ts`, this.generateModule(ModuleName), () => {});
    fs.writeFile(`${path}/${ModuleName}.service.ts`, this.generateService(ModuleName), () => {});
    fs.writeFile(`${path}/${ModuleName}.controller.ts`, this.generateController(ModuleName, noPermission), () => {});

    fs.mkdirSync(path + '/model');
    fs.writeFile(`${path}/model/${ModuleName}.entity.ts`, this.generateEntity(ModuleName), () => {});

    fs.mkdirSync(path + '/dto');
    fs.writeFile(
      `${path}/dto/${ModuleName}.create.dto.ts`,
      this.generateCreateOrUpdateDto(ModuleName, 'Create'),
      () => {},
    );
    fs.writeFile(`${path}/dto/${ModuleName}.delete.dto.ts`, this.generateParamsDto(ModuleName, 'Delete'), () => {});
    fs.writeFile(`${path}/dto/${ModuleName}.search.dto.ts`, this.generateSearchDto(ModuleName), () => {});
    fs.writeFile(`${path}/dto/${ModuleName}.show.dto.ts`, this.generateParamsDto(ModuleName, 'Show'), () => {});
    fs.writeFile(`${path}/dto/${ModuleName}.update.dto.ts`, this.generateUpdateDto(ModuleName), () => {});

    console.log(`Please Add ${this.generateModuleName(ModuleName, true)}Module In AppModule Imports`);
  }

  generateEntity(name: string) {
    const EntityName = this.generateModuleName(name, true);

    return `
    import { CommonEntity } from "@rich";
    import { Entity } from "typeorm";
    
    @Entity("${name}s")
    export class ${EntityName} extends CommonEntity {}
    `;
  }

  generateSearchDto(name: string) {
    const SearchDtoName = this.generateModuleName(name, true);

    return `
    import { CommonSearchDto } from "@rich"

    export class ${SearchDtoName}SearchDto extends CommonSearchDto { }
    `;
  }

  generateParamsDto(name: string, type: 'Show' | 'Delete' | 'UpdateParams') {
    const ParamsDtoName = this.generateModuleName(name, true);

    return `
    import { CommonParamsDto } from '@rich';

    export class ${ParamsDtoName}${type}Dto extends CommonParamsDto {}
    `;
  }

  generateCreateOrUpdateDto(name: string, type: 'Create' | 'UpdatePayload') {
    const dtoName = this.generateModuleName(name, true);

    return `
    export class ${dtoName}${type}Dto {}
    `;
  }

  generateUpdateDto(name: string) {
    return `
    ${this.generateParamsDto(name, 'UpdateParams')}

    ${this.generateCreateOrUpdateDto(name, 'UpdatePayload')}
    
    `;
  }

  generateModule(name: string) {
    const ModuleName = this.generateModuleName(name, true);

    return `
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from "@nestjs/typeorm"
    import { ${ModuleName} } from './model/${name}.entity';
    import { ${ModuleName}Service } from './${name}.service';
    import { ${ModuleName}Controller } from './${name}.controller';
    import { CommonModule } from '@rich';
    
    @Module({
      imports: [
        TypeOrmModule.forFeature([${ModuleName}]),
        CommonModule
      ],
      controllers: [${ModuleName}Controller],
      providers: [${ModuleName}Service],
      exports: [
        ${ModuleName}Service
      ]
    })
    export class ${ModuleName}Module {}
    `;
  }

  generateService(name: string) {
    const ServiceName = this.generateModuleName(name, true);

    return `
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ${ServiceName} } from './model/${name}.entity';
    import { CommonService } from '@rich';
    
    @Injectable()
    export class ${ServiceName}Service extends CommonService {
    
            constructor (
                    @InjectRepository(${ServiceName}) private readonly ${name}Repository: Repository<${ServiceName}>
            ) {
                    super(${name}Repository)
            }
    
    }
    `;
  }

  generateController(name: string, noPermission?: boolean) {
    const ControllerName = this.generateModuleName(name, true);

    return `
    import {
      Controller,
      Get,
      UseGuards,
      UseInterceptors,
      ClassSerializerInterceptor,
      Query,
      Param,
      Body,
      Post,
      Put,
      Delete,
      Response
    } from '@nestjs/common';
    import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
    import { AuthGuard } from '@rich';
    import { ${ControllerName}CreateDto } from './dto/${name}.create.dto';
    import { ${ControllerName}DeleteDto } from './dto/${name}.delete.dto';
    import { ${ControllerName}UpdatePayloadDto, ${ControllerName}UpdateParamsDto } from './dto/${name}.update.dto';
    import { ${ControllerName}ShowDto } from './dto/${name}.show.dto';
    import { ${ControllerName}SearchDto } from './dto/${name}.search.dto';
    import { ${ControllerName}Service } from './${name}.service';
    ${!noPermission ? "import { HasPermission } from '@rich';" : ''}

    @ApiBearerAuth("access-token")
    @UseGuards(AuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiTags('${name}')
    @Controller('${name}')
    export class ${ControllerName}Controller {

          constructor (private ${name}Service: ${ControllerName}Service) { }

        
        ${!noPermission ? '@HasPermission("public")' : ''}
          @Get("search")
          async search(@Query() payload: ${ControllerName}SearchDto, @Response() res) {
            let data = await this.${name}Service.search({ ...payload, ...(payload.getExcel && { sheetName: "${name}" }) })

            if (payload.getExcel) {
                    res.header(
                            "Content-type",
                            "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    )
                            .header("Content-Disposition", 'Content-Disposition: attachment; filename="${name}.xls"')
                            .send(data);
            }


            res.send(data)
          }

        ${!noPermission ? '@HasPermission("public")' : ''}
          @Get("show/:id")
          async show(@Query() payload: ${ControllerName}ShowDto) {
                  return await this.${name}Service.findOne(payload)
          }

        ${!noPermission ? '@HasPermission("public")' : ''}
          @Post("create")
          async create(@Body() payload: ${ControllerName}CreateDto) {
                  return await this.${name}Service.create(payload)
          }

        ${!noPermission ? '@HasPermission("public")' : ''}
          @Put("update/:id")
          async update(@Param() param: ${ControllerName}UpdateParamsDto, @Body() payload: ${ControllerName}UpdatePayloadDto) {
                  return await this.${name}Service.update(param, payload)
          }

        ${!noPermission ? '@HasPermission("public")' : ''}
          @Delete("delete/:id")
          async delete(@Param() payload: ${ControllerName}DeleteDto) {
                  return await this.${name}Service.delete(payload)
          }

    }

    `;
  }

  generateModuleName(name: string, startCap?: boolean) {
    let ModuleName = name.replace(/^[\w,\s-]+\.[A-Za-z]{3}$/g, '').toLowerCase();
    if (startCap) {
      ModuleName = ModuleName.charAt(0).toUpperCase() + ModuleName.slice(1);
    }
    return ModuleName;
  }
}

@Module({
  providers: [CrudCommand],
})
export class AppModule {}

async function bootstrap() {
  await CommandFactory.run(AppModule);
}

bootstrap();
