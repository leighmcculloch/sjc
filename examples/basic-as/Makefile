SJC?=sjc

.PHONY: test

test:
	$(SJC) run contract.ts init
	$(SJC) run contract.ts fund acc:G1
	$(SJC) run contract.ts fund acc:G2
	$(SJC) run contract.ts was_created_by_fund acc:G1
	$(SJC) run contract.ts was_created_by_fund acc:G2
	$(SJC) run contract.ts was_created_by_fund acc:G3
	$(SJC) run contract.ts trust_asset acc:G1 asset:USD:G2
	$(SJC) run contract.ts payment acc:G2 acc:G1 asset:USD:G2 u63:100
	$(SJC) run contract.ts balance acc:G1 native
	$(SJC) run contract.ts balance acc:G1 asset:USD:G2
	$(SJC) run contract.ts balance acc:G2 native
	$(SJC) run contract.ts balance acc:G2 asset:USD:G2
