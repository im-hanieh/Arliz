VERSION    ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_DATE ?= $(shell date -u '+%Y-%m-%d_%H:%M:%S')

WORKSPACE_ROOT := $(shell pwd)
SRC_DIR        := $(WORKSPACE_ROOT)/src
WORKSPACE      := workspace

SCRIPTS_VOL  := $(WORKSPACE_ROOT)/scripts/volumes
CONFIGS_DIR  := $(WORKSPACE_ROOT)/configs/volumes
BUILD_DIR    := $(WORKSPACE_ROOT)/build

ifeq ($(shell [ -d "$(WORKSPACE)" ] && echo 1 || echo 0), 1)
    WORKSPACE_SRC := $(WORKSPACE)/src
else
    WORKSPACE_SRC := $(SRC_DIR)
endif

.PHONY: all vol1 vol2 vol3 volumes \
        generate-vol1 generate-vol2 generate-vol3 \
        clean clean-vol1 clean-vol2 clean-vol3 clean-vols \
        sync build watch version help \
        chapter cover test

all: sync build

sync:
	@bash $(WORKSPACE_SRC)/sync.sh

build: sync
	@bash $(WORKSPACE_SRC)/build.sh

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf build/
	@find . -type f \( \
		-name "*.aux" -o -name "*.log" -o -name "*.out" \
		-o -name "*.toc" -o -name "*.bbl" -o -name "*.blg" \
		-o -name "*.synctex.gz" -o -name "*.fdb_latexmk" \
		-o -name "*.fls" -o -name "*.idx" -o -name "*.ilg" \
		-o -name "*.ind" -o -name "*.run.xml" -o -name "*.bcf" \
		\) -delete 2>/dev/null || true
	@echo "✓ Clean complete"

watch:
	@bash $(WORKSPACE_SRC)/build.sh -w

version:
	@echo "Version:    $(VERSION)"
	@echo "Build date: $(BUILD_DATE)"

chapter:
	@bash $(WORKSPACE_SRC)/generator/chapter.sh $(ARGS)

cover:
	@bash $(WORKSPACE_SRC)/generator/cover.sh workspace.yml

test:
	@echo "Building document..."
	@$(MAKE) clean >/dev/null 2>&1
	@$(MAKE) build >/dev/null 2>&1 && echo "✓ Build successful" || echo "✗ Build failed"

help:
	@echo ""
	@echo "Arliz Build System"
	@echo "────────────────────────────────────────────────────────────────"
	@echo ""
	@echo "VOLUME BUILDS"
	@echo "  make vol1          Compile Volume I   → build/<YEAR>_ARLIZ_Zero_to_Bit_Volume_1.pdf"
	@echo "  make vol2          Compile Volume II  → build/<YEAR>_ARLIZ_Silicon_Horizon_Volume_2.pdf"
	@echo "  make vol3          Compile Volume III → build/<YEAR>_ARLIZ_Array_Odyssey_Volume_3.pdf"
	@echo "  make volumes       Compile all three volumes"
	@echo ""
	@echo "GENERATE ONLY  (for TeXstudio / manual compile)"
	@echo "  make generate-vol1   Produce <YEAR>_ARLIZ_Zero_to_Bit_Volume_1.tex"
	@echo "  make generate-vol2   Produce <YEAR>_ARLIZ_Silicon_Horizon_Volume_2.tex"
	@echo "  make generate-vol3   Produce <YEAR>_ARLIZ_Array_Odyssey_Volume_3.tex"
	@echo ""
	@echo "CLEAN"
	@echo "  make clean           Remove build/ and all LaTeX artifacts"
	@echo "  make clean-vols      Remove all generated volume .tex files and build/"
	@echo "  make clean-vol1      Remove only Volume I artifacts"
	@echo "  make clean-vol2      Remove only Volume II artifacts"
	@echo "  make clean-vol3      Remove only Volume III artifacts"
	@echo ""
	@echo "WORKSPACE (papyrxis)"
	@echo "  make sync            Sync .pxis/ from workspace.yml"
	@echo "  make build           Workspace default build"
	@echo "  make watch           Watch mode (auto-rebuild)"
	@echo ""
	@echo "GENERATORS"
	@echo "  make chapter ARGS='-v 1 -c 3 -t \"Chapter Title\"'"
	@echo "  make cover           Regenerate cover"
	@echo ""
	@echo "UTILITIES"
	@echo "  make version         Show version + build date"
	@echo "  make test            Smoke-test workspace build"
	@echo "  make help            Show this help"
	@echo ""

.DEFAULT_GOAL := help

vol1:
	@$(MAKE) clean-vol1
	@bash "$(SCRIPTS_VOL)/build.sh" vol1

vol2:
	@$(MAKE) clean-vol2
	@bash "$(SCRIPTS_VOL)/build.sh" vol2

vol3:
	@$(MAKE) clean-vol3
	@bash "$(SCRIPTS_VOL)/build.sh" vol3

volumes:
	@$(MAKE) clean-vols
	@bash "$(SCRIPTS_VOL)/build.sh" all

generate-vol1:
	@bash "$(SCRIPTS_VOL)/generate.sh" vol1

generate-vol2:
	@bash "$(SCRIPTS_VOL)/generate.sh" vol2

generate-vol3:
	@bash "$(SCRIPTS_VOL)/generate.sh" vol3

clean-vols:
	@bash "$(SCRIPTS_VOL)/clean.sh"

# Helper macro to get the generated basename for a volume
vol_conf = $(CONFIGS_DIR)/$(1).conf

clean-vol1:
	@rm -rf "$(BUILD_DIR)/vol1" "$(BUILD_DIR)/$(call vol_basename,vol1).pdf" "$(ROOT)/$(call vol_basename,vol1).tex"
	@echo "cleaned vol1 artifacts"
 
clean-vol2:
	@rm -rf "$(BUILD_DIR)/vol2" "$(BUILD_DIR)/$(call vol_basename,vol2).pdf" "$(ROOT)/$(call vol_basename,vol2).tex"
	@echo "cleaned vol2 artifacts"
 
clean-vol3:
	@rm -rf "$(BUILD_DIR)/vol3" "$(BUILD_DIR)/$(call vol_basename,vol3).pdf" "$(ROOT)/$(call vol_basename,vol3).tex"
	@echo "cleaned vol3 artifacts"