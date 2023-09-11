import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
  tableName: 'files',
})
export default class File extends Model {
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
    type: DataType.BLOB('medium'),
    allowNull: false,
  })
  fileContent!: Buffer;

  @Column({
    type: DataType.STRING
  })
  fileType!: string;
}
