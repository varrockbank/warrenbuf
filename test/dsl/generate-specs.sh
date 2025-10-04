#!/bin/bash

# Generate test.spec.generated.js from specs.dsl
# Simple shell script transpiler for DSL to JavaScript

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DSL_FILE="$SCRIPT_DIR/specs.dsl"
OUTPUT_FILE="$SCRIPT_DIR/../test.spec.generated.js"

echo "Generating test.spec.generated.js from specs.dsl..."

# Start output file
cat > "$OUTPUT_FILE" << 'EOF'
// Test definitions
// Generated from specs.dsl
const runner = new TestRunner();

EOF

# Process each line
suite_name=""
test_name=""
in_test=0

while IFS= read -r line || [[ -n "$line" ]]; do
    # Suite header: # Suite Name
    if [[ "$line" =~ ^#\ (.+)$ ]]; then
        # Close previous test if any
        if [ $in_test -eq 1 ]; then
            echo "  }, \"$test_name\");" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            in_test=0
        fi

        # Close previous suite if any
        if [ -n "$suite_name" ]; then
            echo "});" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        fi

        suite_name="${BASH_REMATCH[1]}"
        echo "// $suite_name" >> "$OUTPUT_FILE"
        echo "runner.describe('$suite_name', () => {" >> "$OUTPUT_FILE"
        echo "  let fixture;" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "  runner.beforeEach(() => {" >> "$OUTPUT_FILE"
        echo "    fixture = FixtureFactory.forTest();" >> "$OUTPUT_FILE"
        echo "  });" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"

    # Test header: ## Test Name
    elif [[ "$line" =~ ^##\ (.+)$ ]]; then
        # Close previous test if any
        if [ $in_test -eq 1 ]; then
            echo "  }, \"$test_name\");" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        fi

        test_name="${BASH_REMATCH[1]}"
        echo "  runner.it('should $test_name', () => {" >> "$OUTPUT_FILE"
        in_test=1

    # Test body - transpile DSL commands
    elif [ $in_test -eq 1 ]; then
        # Empty line
        if [ -z "$line" ]; then
            echo "" >> "$OUTPUT_FILE"

        # JavaScript pass-through (ends with semicolon)
        elif [[ "$line" =~ \;$ ]]; then
            echo "$line" >> "$OUTPUT_FILE"

        # TYPE command
        elif [[ "$line" =~ ^TYPE\ \"(.*)\"$ ]]; then
            text="${BASH_REMATCH[1]}"
            # Escape single quotes
            text="${text//\'/\\\'}"
            echo "    fixture.type('$text');" >> "$OUTPUT_FILE"

        # PRESS command
        elif [[ "$line" =~ ^PRESS\ \"(.)\"$ ]] || [[ "$line" =~ ^PRESS\ (.)$ ]]; then
            char="${BASH_REMATCH[1]}"
            echo "    fixture.press('$char').once();" >> "$OUTPUT_FILE"

        # Special keys
        else
            # Parse key, quantification, and qualifications
            trimmed=$(echo "$line" | sed 's/^[[:space:]]*//')

            key=""
            quant=""
            mods=""

            # Determine key
            if [[ "$trimmed" =~ ^backspace ]]; then
                key="Backspace"
                trimmed="${trimmed#backspace}"
            elif [[ "$trimmed" =~ ^enter ]]; then
                key="Enter"
                trimmed="${trimmed#enter}"
            elif [[ "$trimmed" =~ ^left ]]; then
                key="ArrowLeft"
                trimmed="${trimmed#left}"
            elif [[ "$trimmed" =~ ^right ]]; then
                key="ArrowRight"
                trimmed="${trimmed#right}"
            elif [[ "$trimmed" =~ ^up ]]; then
                key="ArrowUp"
                trimmed="${trimmed#up}"
            elif [[ "$trimmed" =~ ^down ]]; then
                key="ArrowDown"
                trimmed="${trimmed#down}"
            fi

            if [ -n "$key" ]; then
                # Extract quantification
                if [[ "$trimmed" =~ [[:space:]]([0-9]+)[[:space:]]times? ]]; then
                    quant="${BASH_REMATCH[1]}"
                fi

                # Extract modifiers
                has_meta=0
                has_shift=0
                if [[ "$trimmed" =~ with ]]; then
                    [[ "$trimmed" =~ meta ]] && has_meta=1
                    [[ "$trimmed" =~ shift ]] && has_shift=1
                fi

                # Build chain
                chain="    fixture.press(Key.$key)"
                [ $has_meta -eq 1 ] && chain="$chain.withMetaKey()"
                [ $has_shift -eq 1 ] && chain="$chain.withShiftKey()"

                if [ -n "$quant" ]; then
                    chain="$chain.times($quant)"
                else
                    chain="$chain.once()"
                fi

                echo "$chain;" >> "$OUTPUT_FILE"
            fi
        fi
    fi
done < "$DSL_FILE"

# Close last test
if [ $in_test -eq 1 ]; then
    echo "  }, \"$test_name\");" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

# Close last suite
if [ -n "$suite_name" ]; then
    echo "});" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
fi

echo "✓ Successfully generated test.spec.generated.js"
