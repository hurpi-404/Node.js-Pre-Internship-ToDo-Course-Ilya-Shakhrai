import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ToDoValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('2. [PIPE] ToDoValidationPipe - Transforming and validating data');
    console.log(`   [PIPE] Type: ${metadata.type}, Data:`, value);
    
    // Transform: trim strings if it's an object with string properties
    if (value && typeof value === 'object') {
      Object.keys(value).forEach(key => {
        if (typeof value[key] === 'string') {
          value[key] = value[key].trim();
        }
      });
    }
    
    console.log('   [PIPE] Data transformed');
    return value;
  }
}
