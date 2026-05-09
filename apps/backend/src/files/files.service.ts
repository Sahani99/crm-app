import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async upload(leadId: string, file: Express.Multer.File, userId: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId, deletedAt: null } });
    if (!lead) throw new NotFoundException('Lead not found');

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: `crm/${leadId}`, resource_type: 'auto' }, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
        .end(file.buffer);
    });

    return this.prisma.attachment.create({
      data: {
        filename: file.originalname,
        url: result.secure_url,
        cloudinaryId: result.public_id,
        leadId,
        uploadedById: userId,
      },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
  }

  async findAll(leadId: string) {
    return this.prisma.attachment.findMany({
      where: { leadId },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new NotFoundException('Attachment not found');

    await cloudinary.uploader.destroy(attachment.cloudinaryId);
    return this.prisma.attachment.delete({ where: { id } });
  }
}