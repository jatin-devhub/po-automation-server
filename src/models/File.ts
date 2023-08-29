import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'files',
})
class File extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileName!: string;

  @Column({
    type: DataType.BLOB,
    allowNull: false,
  })
  fileContent!: Buffer;

  @Column({
    type: DataType.STRING
  })
  fileType!: string;
}

export default File;
