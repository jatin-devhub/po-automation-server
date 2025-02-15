import { AllowNull, AutoIncrement, Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import AttachmentChunk from "./AttachmentChunk";
import AttachmentMapping from "./AttachmentMapping";

@Table({
  tableName: 'attachment',
})
export default class Attachment extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING
  })
  mimeType!: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  totalSizeInBytes!: number;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER
  })
  totalChunks!: number;

  @HasMany(() => AttachmentChunk, { foreignKey: 'attachmentId' })
  chunks!: AttachmentChunk[];

  @HasMany(() => AttachmentMapping, { foreignKey: 'attachmentId' })
  mappings!: AttachmentMapping[];
}
