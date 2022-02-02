import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PresenterOutput } from '../../core/presenter';
import { CreateBlogDto } from '../dtos/CreateBlog.dto';
import { UpdateBlogDto } from '../dtos/UpdateBlog.dto';
import { BlogService } from '../services/blog.service';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/allblogs')
  findAllBlogs(): Observable<PresenterOutput> {
    return this.blogService.findAllBlogs();
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  findAllUserBlogs(@Req() req: any): Observable<PresenterOutput> {
    // console.log(req.user);

    return this.blogService.findAllBlogByUser(req.user.username);
  }

  @Get('/:slug')
  @UseGuards(JwtAuthGuard)
  findBlogBySlug(
    @Param('slug') slug: string,
    @Req() req: any,
  ): Observable<PresenterOutput> {
    // console.log(req.user);

    return this.blogService.findBlogBySlug(slug, req.user.username);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  createBlog(
    @Body() createdBlogDto: CreateBlogDto,
    @Req() req: any,
  ): Observable<PresenterOutput> {
    // console.log(req.user);

    return this.blogService.createBlog(createdBlogDto, req.user.username);
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  updateBlog(
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: any,
  ): Observable<PresenterOutput> {
    console.log(req.user);

    return this.blogService.updateBlog(updateBlogDto, req.user.username);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteBlog(
    @Param('id') id: string,
    @Req() req: any,
  ): Observable<PresenterOutput> {
    console.log(req.user);

    return this.blogService.deleteBlog(id, req.user.username);
  }
}
