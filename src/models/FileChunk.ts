import { Model, Table, Column, DataType, ForeignKey, BelongsTo, AutoIncrement, PrimaryKey, AllowNull } from 'sequelize-typescript';
import File from './File';

@Table({
  tableName: 'file_chunks',
})
export default class FileChunk extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER
  })
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.BLOB('medium')
  })
  chunkContent!: Buffer;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER
  })
  fileId!: number;

  @BelongsTo(() => File)
  file!: File;
}
